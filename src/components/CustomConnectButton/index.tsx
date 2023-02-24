import { ConnectButton } from '@rainbow-me/rainbowkit';
import {GabeText} from '@/components/GabeText';
import {Flame} from '@/components/Flames';

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected =
          ready &&
          account &&
          chain ;
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className="z-999 text-gabe-black hover:text-flame-yellow hover:stroke-flame-orange hover:stroke-2">
                    
                    <GabeText value="Connect" />
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} className="z-999 text-gabe-black hover:text-flame-yellow hover:stroke-flame-orange hover:stroke-2" type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <button onClick={openAccountModal} type="button" className="relative z-999 text-gabe-black hover:text-flame-yellow hover:stroke-flame-orange hover:stroke-2">
                    
                    <GabeText value="Disconnect" size="h-[6vh] z-999"/>
                  </button>
                // <div style={{ display: 'flex', gap: 12 }}>
                //   <button
                //     onClick={openChainModal}
                //     style={{ display: 'flex', alignItems: 'center' }}
                //     type="button"
                //   >
                //     {chain.hasIcon && (
                //       <div
                //         style={{
                //           background: chain.iconBackground,
                //           width: 12,
                //           height: 12,
                //           borderRadius: 999,
                //           overflow: 'hidden',
                //           marginRight: 4,
                //         }}
                //       >
                //         {chain.iconUrl && (
                //           <img
                //             alt={chain.name ?? 'Chain icon'}
                //             src={chain.iconUrl}
                //             style={{ width: 12, height: 12 }}
                //           />
                //         )}
                //       </div>
                //     )}
                //     {chain.name}
                //   </button>
                //   <button onClick={openAccountModal} type="button">
                //     {account.displayName}
                //     {account.displayBalance
                //       ? ` (${account.displayBalance})`
                //       : ''}
                //   </button>
                // </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};